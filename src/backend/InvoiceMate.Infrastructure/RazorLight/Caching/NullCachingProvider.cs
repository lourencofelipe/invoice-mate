using Microsoft.Extensions.Primitives;
using RazorLight.Caching;

public class NullCachingProvider : ICachingProvider
{
    /// <summary>
    /// Igonres cache.
    /// </summary>
    public void CacheTemplate(string key, Func<ITemplatePage> pageFactory, IChangeToken expirationToken)
    {
      
    }

    /// <summary>
    /// It always returns false to force recompilation.
    /// </summary>
    public bool Contains(string key)
    {
        return false;
    }

    public void Remove(string key)
    {

    }

    /// <summary>
    /// It always returns "not found", forcing RazorLight to recompile the template.
    /// </summary>
    public TemplateCacheLookupResult RetrieveTemplate(string key)
    {
        return new TemplateCacheLookupResult();
    }
}
